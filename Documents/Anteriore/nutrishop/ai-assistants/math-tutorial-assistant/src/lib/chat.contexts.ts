import {
  fetchAllCurriculums,
  fetchChapterDetails,
  fetchUserProgress,
  generateFlexibleMapping,
} from "@/helpers/curriculum";
import { ObjectId } from "mongodb";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateMathContext(
  messages: Message[],
  userId: string
): Promise<string> {
  let context =
    `You are an encouraging Math tutor who helps students understand concepts by explaining ideas and asking students questions. Start by introducing yourself to the student as their AI Math Tutor who is happy to help them with any questions. Only ask one question at a time.` +
    `Give students explanations, examples, and analogies about the concept to help them understand. You should guide students in an open-ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading questions. ` +
    `Always consider the last message from the user: ${JSON.stringify(
      messages
    )}. ` +
    `Keep your responses concise and to a minimum of 100 characters. ` +
    `Respond using markdown syntax for better readability, such as headers, lists, and LaTeX code blocks for mathematical equations. ` +
    `Ensure proper spacing and formatting in your responses. ` +
    `Use LaTeX syntax for any mathematical formulas and equations to ensure they are correctly rendered using the format: $<latex code>$ for inline and $$<latex code>$$ for block.`;

  const userMessage = messages[messages.length - 1].content.toLowerCase();

  if (userMessage.includes("follow assistant's curriculum")) {
    try {
      const curriculums = await fetchAllCurriculums();
      context += ` Here are the available units and their chapters:\n\n`;
      curriculums.forEach((curriculum) => {
        context += `### ${curriculum.unitTitle}\n`;
        curriculum.chapters.forEach((chapter) => {
          context += `#### ${chapter.chapterTitle}\n`;
          chapter.lessons.forEach((lesson) => {
            context += `- **${lesson.title}**\n`;
          });
        });
      });
    } catch (error) {
      console.error("Error fetching curriculums:", error);
      context += " Sorry, I could not retrieve the curriculum at this time.";
    }
  } else {
    try {
      const userProgress = await fetchUserProgress(userId);
      const firstChapterId = new ObjectId("667a0d6e43365af175fb7267"); // this is the ID of the first chapter

      if (!userProgress.completedChapters.includes(firstChapterId)) {
        context +=
          " You must complete the first chapter quiz first to access quizzes for other chapters.";
      } else {
        const curriculums = await fetchAllCurriculums();
        const requestedChapter = userMessage.match(/chapter ([0-9]+)/i);
        if (requestedChapter) {
          const chapterNumber = parseInt(requestedChapter[1]);
          const chapter = curriculums[0].chapters[chapterNumber - 1];

          // Check if the user has completed the previous chapter
          if (chapterNumber > 1) {
            const previousChapterId =
              curriculums[0].chapters[chapterNumber - 2]._id;
            if (!userProgress.completedChapters.includes(previousChapterId)) {
              context += ` You must complete Chapter ${
                chapterNumber - 1
              } quiz first to access Chapter ${chapterNumber}.`;
              return context;
            }
          }

          if (chapter) {
            context += `### ${chapter.chapterTitle}\n`;
            chapter.lessons.forEach((lesson) => {
              context += `- **${lesson.title}**: ${lesson.about}\n`;
            });
          } else {
            context += ` No curriculum found for Chapter ${chapterNumber}.`;
          }
        } else {
          context += ` I couldn't find the specified chapter. Please check the chapter title and try again.`;
        }
      }
    } catch (error) {
      console.error("Error in generateMathContext:", error);
      context += " Sorry, an error occurred while processing your request.";
    }
  }

  return context;
}

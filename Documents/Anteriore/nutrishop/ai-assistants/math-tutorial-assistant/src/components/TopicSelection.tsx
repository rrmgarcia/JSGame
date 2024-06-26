"use client";
import { useSession } from "next-auth/react";
import React from "react";

const TopicSelection = ({
  onSelectTopic,
}: {
  onSelectTopic: (topic: string) => void;
}) => {
  const { data: session } = useSession();

  const topics = [
    "Basic Mathematical Operators",
    "Number Theory",
    "Basic Algebra",
    "Basic Geometry",
    "Intro to Trigonometry",
    "Intro to Calculus",
    "Follow Assistant's Curriculum",
  ];

  const handleSelectTopic = async (topic: string) => {
    if (topic === "Follow Assistant's Curriculum" && session?.user?.id) {
      try {
        const response = await fetch("/api/userProgress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: session.user.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize user progress");
        }

        const result = await response.json();
        console.log("User progress initialized:", result);
      } catch (error) {
        console.error("Error initializing user progress:", error);
      }
    }

    onSelectTopic(topic);
  };

  return (
    <div className="absolute top-[30vh] max-md:top-[40vh] max-md:mx-2">
      <div className="grid grid-cols-2 gap-5">
        {topics.map((topic, index) => (
          <div
            key={index}
            className={`bg-[#00000044] h-full p-3 rounded-md  border-[#42424244] hover:bg-gray-500 hover:cursor-pointer ${
              topic.includes("Intro") ? "max-sm:hidden" : null
            } ${
              topic === "Follow Assistant's Curriculum"
                ? "col-span-2 flex justify-center border-4 border-[#075eff42]"
                : "border-[#42424244] border-2"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleSelectTopic(topic);
            }}
          >
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSelection;

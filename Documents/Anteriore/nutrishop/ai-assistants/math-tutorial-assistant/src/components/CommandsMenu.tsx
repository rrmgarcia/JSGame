import React from "react";

interface CommandsMenuProps {
  handleGenerateTest: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CommandsMenu: React.FC<CommandsMenuProps> = ({
  handleGenerateTest,
}) => {
  const commands = [
    {
      title: "Generate Test",
    },
    {
      title: "[command here]",
    },
    {
      title: "[command here]",
    },
    {
      title: "[command here]",
    },
  ];

  return (
    <div className="absolute bottom-20 w-[200px] h-[220px] bg-[#2c2c2c] p-4 rounded-lg z-10">
      <ul className="flex flex-col items-center justify-center gap-1">
        {commands.map((command, index) => (
          <form
            key={index}
            onSubmit={(e) => {
              e.preventDefault();
              if (command.title === "Generate Test") {
                handleGenerateTest(e); // Pass the event to the handler
              }
            }}
          >
            <button
              className="text-sm rounded-sm p-2 hover:bg-gray-500 w-full"
              title="Initiate a conversation to generate test"
            >
              {command.title}
            </button>
            <hr className="w-full border-[#4b4b4b]" />
          </form>
        ))}
      </ul>
    </div>
  );
};

export default CommandsMenu;

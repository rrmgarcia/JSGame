import React from 'react';
import Typewriter from 'typewriter-effect';
import ReactMarkdown from 'react-markdown';

type TypewriterMessageProps = {
  content: string;
};

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({ content }) => {
  return (
    <div className='p-2 rounded bg-gray-300 text-black'>
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(content)
            .callFunction(() => {
              console.log('String typed out!');
            })
            .start();
        }}
        options={{
          delay: 50,
        }}
      />
    </div>
  );
};

export default TypewriterMessage;

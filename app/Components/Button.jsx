import React from "react";

const Button = ({ Name, onClick, xstyles }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 font-semibold py-2 px-4 rounded-xl  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 text-2xl m-2 ${xstyles}`}
    >
      {Name}
    </button>
  );
};

export default Button;

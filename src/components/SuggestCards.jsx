import React from 'react';

const suggestions = [
  { title: 'Java Basics', description: 'Review class definitions and inheritance.' },
  { title: 'PHP Fundamentals', description: 'Practice echo, includes, and require statements.' },
  { title: 'Python Loops', description: 'Master for‑loops and while‑loops with examples.' },
  { title: 'Advanced Java', description: 'Explore abstract classes and the final keyword.' },
];

const SuggestCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {suggestions.map((item, idx) => (
        <div
          key={idx}
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-white border-opacity-30 p-6 transform transition-transform hover:scale-105 hover:shadow-2xl"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-700">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SuggestCards;

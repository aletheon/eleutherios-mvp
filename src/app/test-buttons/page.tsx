'use client';

export default function TestButtons() {
  const handleClick = () => {
    console.log('BUTTON CLICKED!');
    alert('IT WORKS!');
  };

  console.log('Test component rendering...');

  return (
    <div className="p-8">
      <h1>Button Test Page</h1>
      <button 
        onClick={handleClick}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        CLICK ME
      </button>
    </div>
  );
}
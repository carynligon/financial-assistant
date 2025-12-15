export default function MenuButton({
  menuOnClick,
}: {
  menuOnClick: () => void;
}) {
  return (
    <button
      className="p-3 flex w-full text-6xl flex-col text-gray-700 transition-colors dark:text-gray-300 md:w-[158px] cursor-pointer"
      onClick={menuOnClick}
    >
      <div className="h-1 w-10 bg-white my-1"></div>
      <div className="h-1 w-10 bg-white my-1"></div>
      <div className="h-1 w-10 bg-white my-1"></div>
    </button>
  );
}

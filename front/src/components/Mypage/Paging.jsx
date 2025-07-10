import { useEffect } from "react";

export default function Paging({ page, value2, setValue2, totalPage }) {
  const total = Math.ceil(totalPage / page);

  //페이징 이전이면 -1다음이면 +1
  const handlePage = (value) => {
    setValue2((move) => {
      if (value === "prev") {
        return move === 1 ? 1 : move - 1;
      } else if (value === "next") {
        return move === total ? total : move + 1;
      } else {
        return value;
      }
    });
  };

  return (
    <div>
      <button onClick={() => handlePage("prev")}>
        <img src="/images/instrument/left.png" alt="왼쪽 버튼" />
      </button>
      {[...Array(total)].map((_, index) => (
        <p
          key={index}
          onClick={() => handlePage(index + 1)}
          className={`menu ${value2 === index + 1 ? "active" : ""}`}
        >
          {index + 1}
        </p>
      ))}
      <button onClick={() => handlePage("next")}>
        <img src="/images/instrument/right.png" alt="오른쪽 버튼" />
      </button>
    </div>
  );
}

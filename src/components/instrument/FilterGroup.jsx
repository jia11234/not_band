import { Link, useNavigate } from "react-router-dom";

export default function FilterGroup({ category, handleCategory, ProductMenu }) {
  return (
    <div className="filter_group">
      <div className="filter">
        {category &&
          ProductMenu.map(
            (productMenu, index) =>
              productMenu.smenu === category.charAt(0) && (
                <p key={index}>
                  {productMenu.menu.map((item, idx) => (
                    <span key={item}>
                      <Link
                        to={`/not_band/instrument-list?category=${productMenu.link[idx]}`}
                        className={`menu ${category === productMenu.link[idx] ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategory(productMenu.link[idx]);
                        }}
                      >
                        {item}
                      </Link>
                      {idx < productMenu.menu.length - 1 && (
                        <span className="menu_spot">&#8226;</span>
                      )}
                    </span>
                  ))}
                </p>
              ),
          )}
      </div>
    </div>
  );
}

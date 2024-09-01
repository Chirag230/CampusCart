import { useNavigate } from "react-router-dom";
import categories from './categories';
import './Categories.css';

function Categories(props) {
  const navigate = useNavigate();

  return (
    <div className="category-container bg-dark text-light p-3 border-right">
      <div className="d-flex flex-column">
        <span className="font-weight-bold mb-3">All Categories</span>
        {categories && categories.length > 0 && categories.map((item, index) => (
          <span 
            onClick={() => navigate('/category/' + item)} 
            className="mb-2 p-2 text-warning category-item" 
            key={index}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Categories;

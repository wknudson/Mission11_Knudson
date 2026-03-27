import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, totalPrice } = useCart();

  function goToCart() {
    navigate('/cart', { state: { from: location.pathname } });
  }

  return (
    <div
      className="position-fixed top-0 end-0 m-3"
      style={{ zIndex: 1050 }}
    >
      {/* Bootstrap position utilities + badge overlay - #notcoveredinthevideos */}
      <div
        className="card shadow border-primary position-relative"
        style={{ cursor: 'pointer', minWidth: '160px' }}
        onClick={goToCart}
        title="View Cart"
      >
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <span className="fs-4">🛒</span>
          <div className="text-start">
            <div className="fw-bold text-primary lh-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </div>
            <div className="small text-muted">${totalPrice.toFixed(2)}</div>
          </div>
          {totalItems > 0 && (
            /* Bootstrap badge with rounded-pill - #notcoveredinthevideos: position-absolute badge overlay */
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartSummary;

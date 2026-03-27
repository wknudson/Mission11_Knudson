import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  // "Continue Shopping" goes back to wherever the user came from, defaulting to /books
  const returnPath = (location.state as { from?: string })?.from ?? '/books';

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          {/* Bootstrap alert component - #notcoveredinthevideos */}
          <div className="alert alert-info d-inline-block" role="alert">
            Your cart is empty. Start browsing to add some books!
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={() => navigate('/books')}>
              Browse Books
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Bootstrap table with striped + hover - #notcoveredinthevideos: table-striped-columns */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.bookId}>
                    <td className="fw-semibold">{item.title}</td>
                    <td className="text-muted">{item.author}</td>
                    <td className="text-end">${item.price.toFixed(2)}</td>
                    <td className="text-center" style={{ width: '130px' }}>
                      {/* Bootstrap input-group for quantity stepper */}
                      <div className="input-group input-group-sm justify-content-center">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >−</button>
                        <input
                          type="number"
                          className="form-control text-center"
                          style={{ maxWidth: '50px' }}
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateQuantity(item.bookId, Number(e.target.value))}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="text-end fw-semibold text-success">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item.bookId)}
                        title="Remove"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-light fw-bold">
                  <td colSpan={4} className="text-end fs-5">Total:</td>
                  <td className="text-end fs-5 text-success">${totalPrice.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(returnPath)}
              >
                ← Continue Shopping
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
            <button className="btn btn-success btn-lg px-4">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;

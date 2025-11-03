# TODO: Migrate Cart to Redux

- [x] Create cartSlice.js with Redux Toolkit for cart state management, including localStorage persistence
- [x] Create store.js to configure the Redux store
- [x] Update src/main.jsx to wrap the app with Redux Provider
- [x] Update src/App.jsx to remove CartProvider and keep WishlistProvider
- [x] Update src/pages/Cart.jsx to use Redux hooks (useSelector, useDispatch) instead of useCart
- [x] Update src/pages/Checkout.jsx to use Redux hooks instead of useCart
- [x] Test the cart functionality to ensure it works with Redux

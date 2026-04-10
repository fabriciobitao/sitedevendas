import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    hasItemsWithoutPrice,
    sending,
    sent,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
    sendOrder,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div className="cart-header">
          <div className="cart-header-left">
            <h2>Seu Pedido</h2>
            {totalItems > 0 && <span className="cart-count">{totalItems} itens</span>}
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Fechar carrinho">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="cart-empty cart-success">
            <span className="cart-empty-icon">✅</span>
            <p>Pedido enviado com sucesso!</p>
            <span>Você receberá a confirmação pelo WhatsApp</span>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Seu carrinho está esperando</p>
            <span>Explore nosso catálogo e monte seu pedido</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-unit">{item.unit}</span>
                    <span className="cart-item-price">{item.price != null ? `R$ ${item.price.toFixed(2)}` : 'Consulte'}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      {item.price != null ? `R$ ${(item.price * item.quantity).toFixed(2)}` : 'A consultar'}
                    </span>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remover">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <button className="cart-clear" onClick={clearCart}>Limpar carrinho</button>
              <div className="cart-total">
                <span>{hasItemsWithoutPrice ? 'Subtotal' : 'Total'}</span>
                <strong>R$ {totalPrice.toFixed(2)}</strong>
              </div>
              {hasItemsWithoutPrice && (
                <p className="cart-price-note">* Alguns itens precisam de consulta de preço</p>
              )}
              <button
                className="cart-whatsapp-btn"
                onClick={sendOrder}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <span className="cart-spinner" />
                    Enviando pedido...
                  </>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enviar Pedido pelo WhatsApp
                  </>
                )}
              </button>
              <p className="cart-whatsapp-sub">Pedido enviado direto para nosso WhatsApp</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

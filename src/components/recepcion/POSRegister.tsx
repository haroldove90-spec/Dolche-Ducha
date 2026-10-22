import React, { useState } from 'react';
import {
  ProductOrService,
  CartItem,
  SaleTransaction,
  Client,
  Pet,
} from '../../types';
import {
  getProducts,
  getClients,
  getPets,
  getSales,
  saveSales,
} from '../../data/storage';
import {
  CreditCard,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle,
  Receipt,
  User,
  Dog,
  Search,
  Sparkles,
  ShoppingBag,
  DollarSign,
  X,
} from 'lucide-react';

export const POSRegister: React.FC = () => {
  const [products] = useState<ProductOrService[]>(getProducts());
  const [clients] = useState<Client[]>(getClients());
  const [pets] = useState<Pet[]>(getPets());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [search, setSearch] = useState<string>('');

  // Checkout inputs
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [selectedPetName, setSelectedPetName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Tarjeta');
  const [discount, setDiscount] = useState<number>(0);

  // Completed Ticket Modal
  const [completedSale, setCompletedSale] = useState<SaleTransaction | null>(null);

  const categories = [
    'Todos',
    'Servicio de Estética',
    'Higiene & Cosmética',
    'Snack & Premio',
    'Accesorio',
  ];

  const addToCart = (product: ProductOrService) => {
    const existing = cart.find((item) => item.item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { item: product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newSale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      ticketNumber,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      clientName: selectedClientName || 'Cliente Mostrador General',
      petName: selectedPetName || undefined,
      items: cart.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        type: ci.item.type,
        price: ci.item.price,
        quantity: ci.quantity,
      })),
      subtotal,
      discount,
      total,
      paymentMethod,
      cashier: 'Mariana López (Recepción)',
    };

    const existingSales = getSales();
    const updatedSales = [newSale, ...existingSales];
    saveSales(updatedSales);

    setCompletedSale(newSale);
    clearCart();
    setSelectedClientName('');
    setSelectedPetName('');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredProducts = products.filter((prod) => {
    const matchCat =
      selectedCategory === 'Todos' || prod.category === selectedCategory;
    const matchSearch =
      search === '' ||
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#FF8800]" />
            Punto de Venta & Cobro (POS)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Cobro rápido de servicios de estética canina, baños spa, accesorios y snacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-orange-50 text-[#FF8800] border border-orange-200 rounded-xl">
            Caja 01 - Mostrador
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Products & Services Catalog (Left 7-8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar servicio de estética o producto por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FF8800] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => addToCart(prod)}
                className="bg-white rounded-2xl p-4 border border-gray-200/90 hover:border-[#FF8800] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-98 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        prod.type === 'servicio'
                          ? 'bg-orange-50 text-[#FF8800] border border-orange-200/60'
                          : 'bg-pink-50 text-[#B33892] border border-pink-200/60'
                      }`}
                    >
                      {prod.category}
                    </span>
                    {prod.stock !== undefined && (
                      <span className="text-[10px] font-medium text-gray-400">
                        Stock: {prod.stock}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#FF8800] transition line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-base font-bold text-[#0A523C]">
                    ${prod.price} <span className="text-xs font-normal text-gray-500">MXN</span>
                  </span>
                  <button
                    type="button"
                    className="p-1.5 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-[#FF8800] group-hover:text-white transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Cart & Checkout (Right 4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-gray-200/90 shadow-md p-5 space-y-5 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#FF8800]" />
              <h2 className="font-bold text-gray-900 text-base font-heading">
                Ticket Actual
              </h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-medium">El carrito está vacío</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Selecciona servicios o productos del catálogo para agregar
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.item.id}
                  className="flex items-center justify-between gap-2 p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate">
                      {item.item.name}
                    </p>
                    <p className="text-[11px] text-[#0A523C] font-semibold">
                      ${item.item.price} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customer Selection */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Cliente / Dueño (opcional)
              </label>
              <input
                type="text"
                placeholder="Nombre del cliente..."
                value={selectedClientName}
                onChange={(e) => setSelectedClientName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Canino / Mascota (opcional)
              </label>
              <input
                type="text"
                placeholder="Nombre del perrito..."
                value={selectedPetName}
                onChange={(e) => setSelectedPetName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Tarjeta', 'Efectivo', 'Transferencia'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-gray-900 text-white border-black shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Descuento / Cupón (MXN)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="bg-gray-50 p-3.5 rounded-xl space-y-2 border border-gray-200 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal} MXN</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-pink-600 font-semibold">
                <span>Descuento aplicado:</span>
                <span>-${discount} MXN</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
              <span className="font-bold text-gray-900">Total a Cobrar:</span>
              <span className="text-lg font-bold text-[#0A523C]">
                ${total} MXN
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 px-4 font-bold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              cart.length > 0
                ? 'bg-[#0A523C] hover:bg-[#083e2e] text-white active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Cobrar & Generar Ticket</span>
          </button>
        </div>
      </div>

      {/* Ticket Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative">
            <button
              onClick={() => setCompletedSale(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Ticket Receipt */}
            <div id="printable-area" className="p-6 text-gray-800 text-xs font-mono space-y-4">
              <div className="text-center pb-3 border-b border-dashed border-gray-300">
                <img
                  src="https://appdesignproyectos.com/dolcheduchalogo.png"
                  alt="Dolche Ducha"
                  className="h-12 w-auto mx-auto object-contain mb-1"
                />
                <p className="font-bold text-sm tracking-wide text-gray-900">
                  DOLCHE DUCHA SPA CANINO
                </p>
                <p className="text-[11px] text-gray-500">
                  Estética & Bienestar Veterinario
                </p>
                <p className="text-[10px] text-gray-400">
                  Tel: +52 55 4912 8840 • RFC: DDC-261021-9A1
                </p>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Folio:</span>
                  <span className="font-bold text-gray-900">{completedSale.ticketNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha y Hora:</span>
                  <span>{completedSale.date} {completedSale.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Atendió:</span>
                  <span className="truncate max-w-[170px]">{completedSale.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="font-semibold text-gray-900">{completedSale.clientName}</span>
                </div>
                {completedSale.petName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Perrito:</span>
                    <span className="font-semibold text-[#FF8800]">{completedSale.petName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de Pago:</span>
                  <span className="font-semibold">{completedSale.paymentMethod}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="pt-2 border-t border-dashed border-gray-300">
                <div className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex justify-between">
                  <span>Cant. / Concepto</span>
                  <span>Importe</span>
                </div>
                <div className="space-y-1.5">
                  {completedSale.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[11px]">
                      <span className="truncate max-w-[190px]">
                        {it.quantity}x {it.name}
                      </span>
                      <span className="font-bold">
                        ${it.price * it.quantity} MXN
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-dashed border-gray-300 space-y-1 text-right">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>${completedSale.subtotal} MXN</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between text-pink-600">
                    <span>Descuento:</span>
                    <span>-${completedSale.discount} MXN</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                  <span>TOTAL:</span>
                  <span className="text-[#0A523C]">${completedSale.total} MXN</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-500">
                <p>¡Gracias por consentir a tu mejor amigo en Dolche Ducha!</p>
                <p className="mt-0.5">Conserva este comprobante para cualquier aclaración.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 px-3 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ticket</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

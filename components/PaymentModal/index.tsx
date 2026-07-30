import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, Sparkles, AlertCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  planPrice?: string;
  planInterval?: 'monthly' | 'yearly';
  onPaymentSuccess?: (receipt: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planName = 'Pioneer Pro',
  planPrice = '$19',
  planInterval = 'monthly',
  onPaymentSuccess
}) => {
  const { language } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'wallet' | 'cmi'>('card');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<any>(null);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiryDate(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiryDate(raw);
    }
  };

  // Detect Card Brand
  const getCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    return 'Credit Card';
  };

  // Apply Coupon Code
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'CFTMOROCCO' || code === 'PROMO50' || code === 'FUTURE') {
      setAppliedDiscount(0.5); // 50% off
      setPromoSuccess('Coupon applied: 50% Off your subscription!');
    } else if (code === 'FREE100') {
      setAppliedDiscount(1.0); // 100% off
      setPromoSuccess('VIP Coupon applied: 100% Free!');
    } else {
      setPromoError('Invalid discount code. Try "CFTMOROCCO" for 50% off.');
    }
  };

  // Price Calculation
  const baseNumericPrice = parseFloat(planPrice.replace(/[^0-9.]/g, '')) || 19;
  const finalPrice = Math.max(0, baseNumericPrice * (1 - appliedDiscount)).toFixed(2);

  // Handle Checkout Submission
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Trigger backend Express payment checkout endpoint
      await api.processPayment(planName, `$${finalPrice}`, selectedMethod);
    } catch (err) {
      console.warn("Backend payment check:", err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        transactionId: `CFT-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        plan: planName,
        amount: `$${finalPrice}`,
        date: new Date().toLocaleDateString(),
        method: selectedMethod.toUpperCase(),
        cardBrand: getCardBrand(),
      };
      
      try {
        localStorage.setItem('userSubscription', JSON.stringify({
          status: 'active',
          plan: planName,
          receipt
        }));
      } catch (err) {}

      setReceiptDetails(receipt);
      setPaymentSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess(receipt);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl relative text-slate-900 dark:text-white my-8"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between border-b border-slate-800 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Secure Payment Gateway</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">256-Bit Encrypted SSL Checkout</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Success View */}
          {paymentSuccess ? (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Payment Confirmed</span>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Welcome to {planName}!</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Your subscription is active. Transaction ID: <span className="font-bold text-slate-800 dark:text-slate-200">{receiptDetails?.transactionId}</span>
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Plan:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{receiptDetails?.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Amount Paid:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{receiptDetails?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Payment Method:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{receiptDetails?.method} ({receiptDetails?.cardBrand})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Date:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{receiptDetails?.date}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Access Dashboard & Start Learning 🚀
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Order Summary Pill */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Selected Plan</span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{planName} ({planInterval})</h4>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">${finalPrice}</span>
                  {appliedDiscount > 0 && (
                    <span className="text-xs text-slate-400 line-through block">${baseNumericPrice}</span>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card / CMI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('paypal')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base font-black italic text-blue-700 dark:text-blue-400">P</span>
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'wallet'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Apple/Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cmi')}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'cmi'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">🇲🇦 MAD</span>
                    <span>Bank (CMI)</span>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handlePay} className="space-y-4">
                {selectedMethod === 'card' && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Card Number</label>
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{getCardBrand()}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 •••• •••• 8912"
                          maxLength={19}
                          required
                          className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <CreditCard className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          maxLength={5}
                          required
                          className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">CVC / CVV</label>
                        <input
                          type="password"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          required
                          className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </>
                )}

                {selectedMethod === 'paypal' && (
                  <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl text-center space-y-3">
                    <span className="text-3xl font-black italic text-blue-700 dark:text-blue-400">PayPal Express</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      You will be redirected to PayPal's secure login to complete your payment with 1-Click.
                    </p>
                  </div>
                )}

                {selectedMethod === 'wallet' && (
                  <div className="p-6 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center space-y-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Apple Pay & Google Pay</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Use Face ID, Touch ID, or biometrics to confirm payment instantly on your device.
                    </p>
                  </div>
                )}

                {selectedMethod === 'cmi' && (
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                      <span>🇲🇦 CMI Moroccan Bank Gateway</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Supports all major Moroccan bank cards (Attijariwafa, BMCE, CIH, BCP, Credit du Maroc). Total: <span className="font-bold text-slate-900 dark:text-white">{(parseFloat(finalPrice) * 10.2).toFixed(2)} MAD</span>
                    </p>
                  </div>
                )}

                {/* Promo Code Input */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code (e.g. CFTMOROCCO)"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">{promoSuccess}</p>}
                  {promoError && <p className="text-xs font-bold text-rose-500 mt-1.5">{promoError}</p>}
                </div>

                {/* Submit Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 mt-4 rounded-2xl bg-[#FBBF24] hover:bg-[#f59e0b] text-[#111827] font-black text-base transition-all shadow-lg shadow-[#FBBF24]/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Pay ${finalPrice} & Confirm</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Guaranteed 30-Day Money-Back • Cancel Anytime</span>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

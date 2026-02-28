import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Heart, Gift, DollarSign, X, Sparkles, MessageCircle } from 'lucide-react';
import { useRazorpay } from "react-razorpay";
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';
import Button from '../common/Button';
import Card, { CardBody } from '../common/Card';

const BuyMeCoffee = ({ article, author }) => {
  const Razorpay = useRazorpay();
  const { isAuthenticated, user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [10, 50, 100, 250, 500];

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to support this author');
      return;
    }

    const amount = customAmount || selectedAmount;
    
    if (amount < 10) {
      toast.error('Minimum donation amount is ₹10');
      return;
    }

    try {
      setLoading(true);

      // Create order on backend
      const { data } = await api.post('/donations/create-order', {
        amount: amount * 100, // Convert to paise
        author_id: author.user_id,
        article_id: article.article_id,
        message: message.trim(),
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Curio',
        description: `Support ${author.full_name || author.username}`,
        image: '/logo.png',
        order_id: data.order_id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyData = await api.post('/donations/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donation_id: data.donation_id,
            });

            toast.success('Thank you for your support! 💖');
            setShowModal(false);
            setMessage('');
            setCustomAmount('');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.full_name || user?.username,
          email: user?.email,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
      
      razorpayInstance.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Buy Me Coffee Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-amber-200 dark:border-amber-800">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    Enjoying this article?
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Support <span className="font-semibold text-gray-900 dark:text-white">{author.full_name || author.username}</span> with a coffee! ☕
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-xl whitespace-nowrap"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Buy Me Coffee
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => !loading && setShowModal(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg"
              >
                <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
                  <CardBody className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Buy Me Coffee
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Support {author.full_name || author.username}
                          </p>
                        </div>
                      </div>
                      {!loading && (
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    {/* Amount Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Choose Amount
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {predefinedAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount('');
                            }}
                            className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                              selectedAmount === amount && !customAmount
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            ₹{amount}
                          </button>
                        ))}
                      </div>

                      {/* Custom Amount */}
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Custom amount (min ₹10)"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          min="10"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Add a Message (Optional)
                      </label>
                      <textarea
                        rows="3"
                        placeholder="Say something nice to the author..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength="200"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {message.length}/200 characters
                      </p>
                    </div>

                    {/* Total */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border-2 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          Total Amount:
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          ₹{customAmount || selectedAmount}
                        </span>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handlePayment}
                      loading={loading}
                      disabled={loading}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                    >
                      {loading ? (
                        'Processing...'
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>

                    {/* Info */}
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                      Powered by Razorpay • Secure Payment • 100% goes to the author
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BuyMeCoffee;

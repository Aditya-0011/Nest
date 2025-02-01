const Cancel: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold mb-6">Payment Canceled</h1>
      <p className="text-lg">Your payment was canceled. Please try again.</p>
    </div>
  );
};

export default Cancel;

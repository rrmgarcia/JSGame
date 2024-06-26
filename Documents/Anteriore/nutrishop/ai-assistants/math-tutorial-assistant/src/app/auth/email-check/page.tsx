const EmailCheckPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-200">
      <div className="bg-white p-8 mt-16 rounded-lg shadow-md text-center text-black">
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="mb-4">
          We have sent a sign-in link to your email address. Please check your
          inbox and click the link to sign in.
        </p>
      </div>
    </div>
  );
};

export default EmailCheckPage;

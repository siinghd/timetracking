const Denied = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-gray-700">
          You do not have permission to view this page.
        </p>
      </div>
    </div>
  );
};

export default Denied;

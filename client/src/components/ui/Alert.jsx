const alertTypes = {
  success: "alert-success",
  error: "alert-error",
  warning: "alert-warning",
  info: "alert-info",
};

const Alert = ({ type = "info", message, onClose }) => {
  return (
    <div className={`alert ${alertTypes[type]} shadow-lg`}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
      </div>
      {onClose && (
        <div className="flex-none">
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;

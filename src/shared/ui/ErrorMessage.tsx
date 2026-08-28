type ErrorMessageProps = {
  message?: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <p role="alert" className="text-danger mt-[0.6rem] text-[1.2rem]">
      {message}
    </p>
  );
};

export default ErrorMessage;

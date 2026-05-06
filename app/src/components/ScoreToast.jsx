// Renders the +/- floating points number above the input on every submit.
export function ScoreToast({ feedback }) {
  if (!feedback || feedback.points == null) return null;
  const positive = feedback.points > 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center">
      <span
        key={feedback.points + ":" + Math.random()}
        className={
          "font-display font-extrabold text-3xl sm:text-4xl animate-fly-in " +
          (positive ? "text-good" : "text-bad")
        }
      >
        {positive ? `+${feedback.points}` : feedback.points}
      </span>
    </div>
  );
}

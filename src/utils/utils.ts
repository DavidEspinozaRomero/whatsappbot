
export function wait(durationInSeconds) {
  return new Promise((resolve) =>
    setTimeout(resolve, durationInSeconds * 1000)
  );
}

// Usage example
// await Delay(3000);  //simulate time to make api call

export function Delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function Wait(milliseconds) {
  return Delay(milliseconds);
}

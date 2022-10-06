let fire;

function __setupMocks(f) {
  fire = f;
}

function newCircuitBreaker() {
  return { fire: () => fire() };
}

export default newCircuitBreaker;

export { __setupMocks, fire };

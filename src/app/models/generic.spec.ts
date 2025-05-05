import Generic from "./generic.model";

describe('Generic', () => {
  it('should create an instance', () => {
    expect(new Generic(0)).toBeTruthy();
  });

  it('should assign and get id from getter and setter', () => {
    const auxGen = new Generic(0);

    auxGen.setId(10);

    expect(auxGen.getId()).toBe(10);
  })
});
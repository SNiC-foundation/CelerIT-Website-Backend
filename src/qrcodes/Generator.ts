abstract class Generator {
  protected text: string;

  protected location: string;

  constructor(text: string, location: string) {
    this.text = text;
    this.location = location;
  }

  public abstract generateCode(): Promise<void>;
}

export default Generator;

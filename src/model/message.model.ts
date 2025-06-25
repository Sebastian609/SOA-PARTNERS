export interface messageMetadata {
  content: string;
  timestamp: Date;
  title: string; 
  saleId: number
}

export class Message {
  content: string;
  timestamp: Date;
  title: string;
  saleId: number

  constructor(content: string, title: string, saleId: number) {
    this.content = content;
    this.timestamp = new Date();
    this.title = title;
    this.saleId = saleId;
  }

  // Método para obtener los metadatos del mensaje
  getMetadata = (): messageMetadata => {
    const metadata: messageMetadata = {
      saleId: this.saleId,
      content: this.content,
      title: this.title,
      timestamp: this.timestamp,
    };
    return metadata;
  };
}

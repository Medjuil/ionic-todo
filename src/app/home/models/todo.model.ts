export class Todo{
  id: number;
  title: string;
  description: string;
  status: boolean;

  constructor(id: number, title: string, description: string, status: boolean = false){
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

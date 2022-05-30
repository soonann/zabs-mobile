import { Item } from './RTItem';


export class Transaction{

        constructor(
                public items: Item[],
                public subItems?: Item[],
                public subtotal?: number, 
                public total?: number
                ){
                
        }
}
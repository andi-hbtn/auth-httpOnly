import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('user')
export class UserEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    firstname:string;

    @Column()
    lastname:string

    @Column({unique:true})
    email:string;

    @Column()
    password:string
    
}
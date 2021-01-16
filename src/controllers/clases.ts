//Clases que manejará typescript internamente para los datos de graphql
export class General {
    protected id: number | null;

    public constructor(id: number | null = null) {
        this.id = id;
    };

    protected processObject(object: any): any {
        for(let key in object) {
            if(!(object[key])) {
                delete object[key];
            }
        }
        return object;
    };

    public getObject(): any {};

    public getArray(): any[] {
        let array: any[] = [];
        const object = this.getObject();
        for(let key in object) {
            array.push(object[key]);
        }
        return array;
    };
};

export class Cliente extends General {
    private edad: number;
    private nombre: string; private apellido: string;

    public constructor(object: { [x: string]: any; }) {
        super(object.k_id || object.id);
        this.nombre = object.n_nombre || object.nombre;
        this.apellido = object.n_apellido || object.apellido;
        this.edad = object.q_edad || object.edad;
    };

    public getObject(): any {
        return super.processObject({
            K_ID: this.id,
            N_NOMBRE: this.nombre,
            N_APELLIDO: this.apellido,
            Q_EDAD: this.edad
        });
    };

};

export class Cuenta extends General {
    private contrasenna: number;
    private saldo: string;
    private tipo: string;
    
    public constructor(object: { [x: string]: any; }) {

        let saldo = object.q_saldo || object.saldo;
        let typeMoney: boolean = false;
        
        super(object.k_idcuenta || object.id);
        this.contrasenna = object.q_contrasenna || object.contrasenna;
        this.saldo = '';
        this.tipo = object.n_tipo || object.tipo;

        if(saldo[0] === '$') {
            saldo = saldo.substring(1, saldo.length);
            typeMoney = true;
        }
        for(let i of saldo) {

            if(i !== '.' && i != ',' && i != ' ') this.saldo += i;
        }
        this.saldo = (typeMoney)? this.saldo.substring(0, this.saldo.length - 2) : this.saldo;
    };

    public getObject(): any {
        return super.processObject({
            K_IDCUENTA: this.id,
            Q_SALDO: this.saldo,
            N_TIPO: this.tipo,
            Q_CONTRASENNA: this.contrasenna
        });
    };

};

export class Transaccion extends General {
    private idCuenta: string;
    private fecha: string;
    private operacionDescripcion: string; private operacionTipo: string;

    public constructor(object: { [x: string]: any; }) {
        super(object.k_idtx || object.id);
        this.fecha = (new Date(object.d_date)).toDateString();
        this.operacionDescripcion = object.o_descripcion || object.operacionDescripcion;
        this.operacionTipo = object.o_tipo || object.operacionTipo;
        this.idCuenta = object.k_idcuenta || object.idCuenta;
    };

    public getObject(): any {
        return super.processObject({
            K_IDTX: this.id,
            K_IDCUENTA: this.idCuenta,
            D_DATE: this.fecha,
            O_DESCRIPCION: this.operacionDescripcion,
            O_TIPO: this.operacionTipo
        });
    };
    
};
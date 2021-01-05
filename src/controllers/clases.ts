export abstract class General {
    protected id: number | null;

    public constructor(id: number | null) {
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

    public abstract getObject(): any;

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

    public constructor(id: number | null, nombre: string, apellido: string, edad: number) {
        super(id);
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
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
    
    public constructor(id: number | null, contrasenna: number, saldo: string, tipo: string) {
        super(id);
        this.contrasenna = contrasenna;
        this.saldo = saldo;
        this.tipo = tipo;
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

export class Fecha extends General {
    private dia: number; private mes: number; private anno: number;

    public constructor(dia: number, mes: number, anno: number) {
        super(null);
        this.dia = dia;
        this.mes = mes;
        this.anno = anno;
    };

    public getObject(): any {
        return super.processObject({
            F_DIA: this.dia,
            F_MES: this.mes,
            F_ANNO: this.anno
        });
    };

};

export class Transaccion extends General {
    private idCuenta: string;
    private fecha: Fecha;
    private operacionDescripcion: string; private operacionTipo: string;

    public constructor(id: number | null, fecha: Fecha, operacionDescripcion: string, operacionTipo: string, idCuenta: string) {
        super(id);
        this.fecha = fecha;
        this.operacionDescripcion = operacionDescripcion;
        this.operacionTipo = operacionTipo;
        this.idCuenta = idCuenta;
    };

    public getObject(): any {
        return super.processObject({
            K_IDTX: this.id,
            K_IDCUENTA: this.idCuenta,
            F_DIA: this.fecha.getObject().F_DIA,
            F_MES: this.fecha.getObject().F_MES,
            F_ANNO: this.fecha.getObject().F_ANNO,
            O_DESCRIPCION: this.operacionDescripcion,
            O_TIPO: this.operacionTipo
        });
    };
    
};
# Patrones

## Constructor Pattern
Crea objetos a partir de un funcion constructora. 

Se le pueden añadir nuevas propiedades, comunes a cada instancia del objeto (como por ejemplo fucciones) a través de su prototipo. Hacerlo así optimiza el rendimiento, sobre todo para cuando se instancia mucha sveces un mismo objeto.

```javascript

//función que crea el objeto
function MyObject(i, n) {     
  this.id = i;
  this.nombre = n;
}

//funcion que añadimos al prototipo, para no añadirla a cada objeto
MyObject.prototype.mostrarEnConsola = function () {
    console.log(this.id,' >>> ',this.nombre);
  };

//creamos el objeto
var a = new MyObject(2,'dos')

//llamamos a la funcion creada en el prototiopo
a.mostrarEnConsola()


```
Otro ejemplo

```javascript
function Car( model, year, miles ) {
  this.model = model;
  this.year = year;
  this.miles = miles;
}
 
 
// Note here that we are using Object.prototype.newMethod rather than
// Object.prototype so as to avoid redefining the prototype object
Car.prototype.toString = function () {
  return this.model + " has done " + this.miles + " miles";
};
 
// Usage:
 
var civic = new Car( "Honda Civic", 2009, 20000 );
var mondeo = new Car( "Ford Mondeo", 2010, 5000 );
 
console.log( civic.toString() );
console.log( mondeo.toString() );

```


## Singleton pattern
El patrón singleton se utiliza cuando queremos que exista una sola instancia de una clase particular en toda la aplicación. Cuando alguien instancia una clase singleton debemos comprobar si ya existe una instancia y, si es así, devolver esa instancia. Si no existe, se crea.

```javascript

//Encerramos todo dentro de un namespace propio 
var mySingleton = (function() {
 
    //Singleton constructor is private
    function Singleton() {
        //Esta sería una variable privada
        var privateVar1 = "I'm a private var";
        //Estas son las propiedades y metodos publicos del singleton
        this.publicVar1 = "I'm a public var";
        this.algo = 'algo'
        this.publicMethod1 = function() {
          console.log("Private var: " + privateVar1 
          + " public var: " + this.publicVar1);
        }
        this.otrometodosingleton = function()  {
        console.log('soy yo')
        }
    }
 
    //variable privada donde guardamos la instancia de singeton
    var singleInstance;
 
    //Devolvemos siempre un objeto que contiene la unica 
    //instancia del objeto singleton, a través del método getInstance.
    return {
        getInstance: function() {
          if (!singleInstance) singleInstance = new Singleton();
          return singleInstance;
 
        }
    }
 
})()

```


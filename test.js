// // Se crean y asignan cuatro variables de una sola vez,
// // separadas por comas
// var myObj = new Object(),
//   str = "myString",
//   rand = Math.random(),
//   obj = new Object();

// myObj.type = "Sintaxis de puntos";
// myObj["fecha de creación"] = "Cadena con espacios";
// myObj[str] = "Valor de cadena";
// myObj[rand] = "Número aleatorio";
// myObj[obj] = "Object";
// myObj[""] = "Incluso una cadena vacía";

// console.log(myObj);

// var myCar = {
//   make: "Ford",
//   model: "Mustang",
//   year: 1969,
// };

// function showProps(obj, objName) {
//   var result = ``;
//   for (var i in obj) {
//     // obj.hasOwnProperty() se usa para filtrar propiedades de la cadena de prototipos del objeto
//     if (obj.hasOwnProperty(i)) {
//       result += `${objName}.${i} = ${obj[i]}\n`;
//     }
//   }
//   return result;
// }

// console.log(showProps(myCar, 'myCar'))

function addLikes(obj, likes) {
  obj.likes = likes;
}

var myCar = {
  make: "Ford",
  model: "Mustang",
  year: 1969,
};

addLikes(myCar, 10);
console.log(myCar);
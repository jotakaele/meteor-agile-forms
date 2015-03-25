//Libreria de uso comun para usar en cualquier lado
onl = {
    u: function(string) {
        return string.toUpperCase()
    },
    link: function(opt) {
        var cad = ""
        $.each(opt, function(key, value) {
            if (key != 'texto') {
                cad = cad + ' ' + key + '="' + value + '"'
            }
        })
        return '<a ' + cad + '>' + opt.texto + '</a>'
    },
    arr2label: function(theArray) {
        var tx = ''
        theArray.forEach(function(txt, clase) {
            tx = tx + '<span class="label ' + clase + '">' + txt + '</span>'
        })
        return tx
    },
    textCollapse: function(texto, characters) {
        var theId = '_' + makeId(6)
        var char = characters || 20
        var action = 'onclick = "$(\'#' + theId + '\').toggle(200)"'
        tx = '<a class="showmore" showid="makeId" title="' + texto + '" ' + action + '>' + _(texto).prune(char) + '</a>'
        tx = tx + '<div id="' + theId + '" style="display:none;"' + action + '>' + texto + '</div>'
        return tx
    },
    randomSeedColor: function(cadena) {
        function seedColor(seed) {
            return (Math.ceil(Math.abs(Math.sin(seed == undefined ? seed = Math.random() : seed = seed)) * 16777215) % 16777215).toString(16);
        }
        var master = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzñÑ?¡<>="\'_';
        var res = ''
        cadena = cadena + ' '
        cadena.split('').forEach(function(car) {
                res = res + master.indexOf(car) || 0
            })
            // console.log(res)
        return '#' + seedColor(parseFloat(res))
    },
    //Crea un elemento div justo debajo de $el y si existe le asigna className
    createDivInPlace: function($el, className) {
        $('div.in-place').remove()
        var pos = $el.position()
        pos.top += $el.innerHeight()
        var divId = makeId(4)
            //console.log(pos)
        var $theFrameDiv = $('<div>', {
            class: 'in-place ' + className || '',
            style: 'top:' + pos.top + 'px;left:' + pos.left + 'px;min-width:' + $el.innerWidth() + 'px;'
        }).appendTo($el.closest('div'))
        $theClose = $('<i>', {
            class: 'close fa fa-close right'
        }).appendTo($theFrameDiv)
        $theClose.on('click', function() {
            $(this).closest('.in-place').fadeOut(200, function() {
                $theFrameDiv.remove()
            })
        })
        $theDiv = $('<div>', {
            id: divId
        }).appendTo($theFrameDiv)
        return divId;
    },

    detectarModoCuenta: function(cad) {
        cad = cad.replace(/[-. _\/]/g, '')
        if (cad.length == 20) {
            return 'cc';
        } else if (cad.length > 20) {
            return 'iban'
        }
    },

    calcularIBAN: function(numerocuenta, codigopais) {
        //Conversión de letras por números
        //A=10 B=11 C=12 D=13 E=14
        //F=15 G=16 H=17 I=18 J=19
        //K=20 L=21 M=22 N=23 O=24
        //P=25 Q=26 R=27 S=28 T=29
        //U=30 V=31 W=32 X=33 Y=34
        //Z=35


        if (codigopais.length != 2) {
            console.log('Error en codigo pais')
            return "";
        } else {
            numerocuenta = numerocuenta.replace(/[-. _\/]/g, '')
            if (numerocuenta.length != 20) {
                console.log('Error en número de cuenta')
                return "";
            }
            codigopais = codigopais.toUpperCase()
            var Aux;
            var CaracteresSiguientes;
            var TmpInt;
            var CaracteresSiguientes;

            numerocuenta = numerocuenta + (codigopais.charCodeAt(0) - 55).toString() + (codigopais.charCodeAt(1) - 55).toString() + "00";

            //Hay que calcular el módulo 97 del valor contenido en número de cuenta
            //Como el número es muy grande vamos calculando módulos 97 de 9 en 9 dígitos
            //Lo que se hace es calcular el módulo 97 y al resto se le añaden 7 u 8 dígitos en función de que el resto sea de 1 ó 2 dígitos
            //Y así sucesivamente hasta tratar todos los dígitos

            TmpInt = parseInt(numerocuenta.substring(0, 9), 10) % 97;

            if (TmpInt < 10)
                Aux = "0";
            else
                Aux = "";

            Aux = Aux + TmpInt.toString();
            numerocuenta = numerocuenta.substring(9);

            while (numerocuenta != "") {
                if (parseInt(Aux, 10) < 10)
                    CaracteresSiguientes = 8;
                else
                    CaracteresSiguientes = 7;

                if (numerocuenta.length < CaracteresSiguientes) {
                    Aux = Aux + numerocuenta;
                    numerocuenta = "";
                } else {
                    Aux = Aux + numerocuenta.substring(0, CaracteresSiguientes);
                    numerocuenta = numerocuenta.substring(CaracteresSiguientes);
                }

                TmpInt = parseInt(Aux, 10) % 97;

                if (TmpInt < 10)
                    Aux = "0";
                else
                    Aux = "";

                Aux = Aux + TmpInt.toString();
            }

            TmpInt = 98 - parseInt(Aux, 10);

            if (TmpInt < 10)
                return codigopais + "0" + TmpInt.toString();
            else
                return codigopais + TmpInt.toString();

        }
    }
}

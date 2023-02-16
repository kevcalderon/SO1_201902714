#Cantidad total de logs registrados.
echo "La cantidad de logs registros son: $(wc -l history.log)"  
#Cantidad total de operaciones que resultaron en error.
echo "La cantidad de errores fueron: $(grep -o "Math Error!" history.log | wc -l)" 

#Cantidad de operaciones por separado, es decir, número de sumas, restas, multiplicaciones y divisiones.
#suma
echo "La cantidad de sumas que hay en el archivo son: $(grep '+' history.log | wc -l)"
#resta

echo "La cantidad de restas que hay en el archivo son: $(grep ',-,' history.log | wc -l)"
#division
echo "La cantidad de divisiones que hay en el archivo son: $(grep -c ',/,' history.log | wc -l)"
#multiplicacion
echo "La cantidad de multiplicaciones que hay en el archivo son: $(grep '*' history.log | wc -l)"

#Mostrar los logs del día de hoy.
fecha="16/02/2023"
grep -w -e $fecha history.log
#la bandera -w es para buscar en palabra completa 
#la bandera -e para especificar la expresion regular a buscar.


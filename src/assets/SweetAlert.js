import Swal from 'sweetalert2';
import './sweetalert-marcial.css';

export function dispararSweetBasico(titulo, text, icon, textoBoton) {
  Swal.fire({
    title: titulo,
    text: text,
    icon: icon,
    confirmButtonText: textoBoton,
    background: '#1c1c1c',
    color: '#f1f1f1',
    iconColor: '#44A901', // Color del ícono
    width: '600px',
    customClass: {
      title: 'titulo-marcial',
      confirmButton: 'boton-marcial-amarillo',
      popup: 'popup-marcial',
    },
  });
}

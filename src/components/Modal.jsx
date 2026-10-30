
function Modal({ titulo, children, onFechar }) {
  return (
    <div
      className="modal_fundo"
      onClick={onFechar}
    >
      <div
        className="modal_noticia"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{titulo}</h2>

        {children}
      </div>
    </div>
  );
}

export default Modal;

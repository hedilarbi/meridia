export default function AppCTA(){
  return (
    <section className="container mt-4 mb-4">
      <div className="row g-3 align-items-center bg-white rounded-3 p-4 shadow-sm">
        <div className="col-md-8">
          <h5 className="fw-bold">Allez plus loin avec l'appli</h5>
          <p className="text-muted small">Scannez le QR code pour télécharger l'appli et accéder aux offres.</p>
        </div>
        <div className="col-md-4 text-center">
          <div className="d-inline-block p-3 bg-light rounded-3">QR</div>
        </div>
      </div>
    </section>
  );
}
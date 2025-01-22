function Footer({ footer, copyright }) {
  return (
    <footer className={footer}>
      <p className={copyright}>
        &copy; Copyright {new Date().getFullYear()} by WorldWise
      </p>
    </footer>
  );
}

export default Footer;

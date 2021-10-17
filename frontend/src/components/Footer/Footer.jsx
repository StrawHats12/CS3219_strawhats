const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center text-capitalize mt-auto">
      copyright StrawHats &copy; {year}
    </footer>
  );
};

export default Footer;

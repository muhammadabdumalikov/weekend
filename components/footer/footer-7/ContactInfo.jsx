const ContactInfo = () => {
  const contactContent = [
    {
      id: 1,
      title: "Toll Free Customer Care",
      action: "tel:+998937377793",
      text: "+998937377793",
    },
    {
      id: 2,
      title: "Need live support?",
      action: "mailto:inmakon@gmail.com",
      text: "inmakon@gmail.com",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="mt-30" key={item.id}>
          <div className="mt-30">
            <div className="text-14 mt-30">{item.title}</div>
            <a href="#" className="text-18 fw-500 mt-5">
              {item.text}
            </a>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;

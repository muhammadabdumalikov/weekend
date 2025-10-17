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
        <div className="col-sm-6" key={item.id}>
          <div className={"text-14"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 text-dark-1 mt-5">
            {item.text}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;

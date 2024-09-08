import React from 'react';
import axiosInstance from "../axios/instanse";
import { useNavigate } from 'react-router-dom';

const BookCatalog = ({ books }) => {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1rem',
    justifyContent: 'center',
  };

  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '250px',
    width: '100%',
  };

  const imgStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '0.25rem',
  };

  const authorStyle = {
    color: 'gray',
    fontSize: '14px',
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#4a4a4a',
    maxHeight: '100px',
    overflowY: 'auto',
    marginBottom: '0.5rem',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    marginRight: '0.5rem',
    fontSize: '14px',
  };

  const reserveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'green',
    ':hover': { backgroundColor: 'darkgreen' },
  };

  const navigate = useNavigate()

  const ebooks = [
    {
      _id: 'ebook1',
      title: 'Преступление и наказание',
      author: 'Федор Михайлович Достоевский',
      media_urls: ['https://s.f.kz/prod/526/525835_1000.jpg'],
      description: 'Роман Федора Михайловича Достоевского «Преступление и наказание» был вдохновлен жизнью самого писателя: идея произведения зародилась, когда он отбывал наказание на каторге в Омске. Текст, начинавшийся как исповедь, превратился, по словам автора, в «психологический отчет одного преступления». История студента Раскольникова, посвященная преступлению и раскаянию, трудному моральному выбору и поиску света даже в самые темные времена, стала одной из важнейших книг в мировой литературе и остается актуальной и по сей день.',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/e8e438f2-aee5-4882-9e4c-9eb48bb64cbd_1725782311341_crime.pdf"
    },
    {
      _id: 'ebook2',
      title: 'Капитанская дочка',
      author: 'Александр Сергеевич Пушкин',
      media_urls: ['https://s.f.kz/prod/613/612117_550.jpg'],
      description: '«Повести Белкина» — цикл из пяти повестей. Временами — трагические, временами — забавные, а порой даже мистические, они рассказывают нам истории о любви, мести, одиночестве, о поиске смысла жизни. «Дубровский» — увлекательный роман-повесть о внезапно вспыхнувшем чувстве между потомками двух враждующих семейств. «Капитанская дочка» — исторический роман, в котором на фоне крестьянского восстания Емельяна Пугачева разворачивается трогательная история любви. И наконец, неоконченное произведение «Арап Петра Великого» — первая попытка наиболее полно описать время правления Петра I, а также рассказ о судьбе предка Пушкина Абрама Петровича Ганнибала. Все эти произведения объединяет тонкое и глубокое описание характеров персонажей, будь то крестьянин или помещик, влюбленная девушка или мятежник Пугачев, богатейший русский язык и, наконец, мастерское умение создавать увлекательные сюжеты — не случайно по прозе Пушкина снято столько фильмов.',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/4c736c12-eb58-4966-b9d9-ba2144435703_1725782274384_capitain.pdf"
    },
    {
      _id: 'ebook3',
      title: '1984',
      author: 'Джордж Оруэлл',
      media_urls: ['https://s.f.kz/prod/2409/2408258_1000.jpg'],
      description: 'Своеобразный антипод второй великой антиутопии XX века — «О дивный новый мир» Олдоса Хаксли. Что, в сущности, страшнее: доведенное до абсурда «общество потребления» — или доведенное до абсолюта «общество идеи»? По Оруэллу, нет и не может быть ничего ужаснее тотальной несвободы... Каждый день Уинстон Смит переписывает историю в соответствии с новой линией Министерства Правды. С каждой ложью, которую он переносит на бумагу, Уинстон всё больше ненавидит Партию, которая не интересуется ничем кроме власти, и которая не терпит инакомыслия. Но чем больше Уинстон старается думать иначе, тем сложнее ему становится избежать ареста, ведь Большой Брат всегда следит за тобой...',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/a62ebb73-69f8-4a97-b78e-1df832192854_1725782197120_1984.pdf"
    },
    {
      _id: 'ebook4',
      title: 'Бесприданница',
      author: 'Александр Николаевич Островский',
      media_urls: ['https://s.f.kz/prod/688/687095_1000.jpg'],
      description: 'В сборник вошли две, наверное, самые знаменитые пьесы Островского — «Гроза» (1859 г.) и «Бесприданница» (1878 г.). В обеих пьесах описывается трагическая судьба их героинь. Две разбитые жизни. Два пылких сердца. Две пронзительные истории любви. И две попытки вырваться из замкнутого круга. Во времена Островского «Гроза» произвела эффект разорвавшейся бомбы, не случайно критик Добролюбов назвал ее героиню «лучом света в темном царстве». Несмотря на то, что времена поменялись, пьесы не теряют своей актуальности. Потому что ханжество, показная добродетель, эгоизм и себялюбие всегда будут противостоять искренним чувствам и настоящим порывам души.',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/373911b7-daf9-4de9-844d-2a221a00adc0_1725782377505_rus.pdf"
    },
    {
      _id: 'ebook5',
      title: 'Дюна',
      author: 'Фрэнк Герберт',
      media_urls: ['https://s.f.kz/prod/1609/1608205_1000.jpg'],
      description: 'Фрэнк Герберт успел написать много, но в истории остался прежде всего как автор эпопеи «Дюна». Возможно, самой прославленной фантастической саги двадцатого столетия, саги, переведенной на десятки языков и завоевавшей по всему миру миллионы поклонников. Самый авторитетный журнал научной фантастики «Локус» признал «Дюну», первый роман эпопеи о песчаной планете, лучшим научно-фантастическим романом всех времен и народов. В «Дюне» Фрэнку Герберту удалось совершить невозможное — создать своеобразную «хронику далекого будущего». И не было за всю историю мировой фантастики картины грядущего более яркой, более зримой, более мощной и оригинальной. Песчаная планета Арракис, Дюна, — единственный на всю Вселенной источник «пряности». Тот, кто контролирует «пряность», контролирует саму Вселенную, ведь без неё немыслимы сами межзвёздные перелёты. Последние десятилетия правами на добычу пряности владел Великий дом Харконненов. Однако недавно падишах-император Шаддам IV, правитель всей известной человечеству части вселенной, отобрал у Харконненов концессию и передал её их злейшим врагам — дому Атрейдесов. Лето Атрейдес, мудрый и справедливый глава дома Атрейдесов, понимает, что коварные Харконнены пойдут на всё, чтобы вернуть себе главный источник дохода. Но он и не подозревает, что вся эта затея — лишь часть хитрого плана по уничтожению дома Атрейдесов. Замыслил этот план вовсе не Харконнен, и ловушка уже вот-вот готова захлопнуться.',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/5339c581-1cfd-4c20-9f2c-671cb304592f_1725782332848_duna.pdf"
    },
    {
      _id: 'ebook6',
      title: 'Горе от ума',
      author: 'Александр Сергеевич Грибоедов',
      media_urls: ['https://s.f.kz/prod/627/626687_1000.jpg'],
      description: '«Горе от ума» — шедевр русской литературы, произведение, раздерганное на цитаты и крылатые фразы чуть не от первого до последнего слова. «Собрать бы книги все да сжечь», «карету мне, карету», «в деревню, к тетке, в глушь, в Саратов», «она к нему — а он ко мне»… Мы используем фразы из «Горя от ума» настолько часто, что даже не осознаем, что это — цитаты. Не потому ли горькая, язвительная и блестящая комедия Грибоедова по-прежнему актуальна и по сей день не сходит с лучших театральных сцен нашей страны?',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/deb4ff5e-2bac-415e-b9b1-a27e2d003001_1725782355114_mind.pdf"
    },
    {
      _id: 'ebook7',
      title: 'Старик и море. Зеленые холмы Африки',
      author: 'Эрнест Миллер Хемингуэй',
      media_urls: ['https://s.f.kz/prod/766/765201_1000.jpg'],
      description: '«Старик и море». Повесть посвящена «трагическому стоицизму»: перед жестокостью мира человек, даже проигрывая, должен сохранять мужество и достоинство. Автобиографическая повесть «Зеленые холмы Африки» — одно из произведений, заложивших основу мифа о «папе Хэме» — смелом до безумия авантюристе-интеллектуале, любимце женщин, искателе сильных ощущений и новых впечатлений.',
      is_from_library: true,
      pdfName: "https://nf-2024.s3.amazonaws.com//hack-the-bookshelf/adb80a20-c52f-4d63-b0fc-65630ff37f56_1725782400901_sea.pd"
    },
  ];

  const handleReserveClick = async (cardId) => {
    try {
      const rep = await axiosInstance.post(`/books/reserv?bookId=${cardId}`);
      console.log(rep);
      toast("Successfully booked. View more in filed reservations");
    } catch (error) {
      console.error('Error booking book:', error);
    }
  };

  const handleEbookClick = (pdfName) => {
    const encodedPdfName = encodeURIComponent(pdfName);
    navigate(`/pdf?url=${encodedPdfName}`);
    };
  
  return (
    <div style={containerStyle}>
      {ebooks.map((ebook, index) => (
        <div key={index} style={cardStyle}>
          <img
            src={ebook.media_urls[0]}
            alt={ebook.title}
            style={imgStyle}
          />
          <p style={titleStyle}>{ebook.title}</p>
          <p style={authorStyle}>{ebook.author}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={ebook.pdfName}
                          >
              Open PDF
            </a>
          </div>
        </div>
      ))}
      {/* Отображение книг из базы данных */}
      {books.map((book) => (
        <div key={book._id} style={cardStyle}>
          <img
            src={book.media_urls[0]}
            alt={book.title}
            style={imgStyle}
          />
          <p style={titleStyle}>{book.title}</p>
          <p style={authorStyle}>{book.author}</p>
          <p style={descriptionStyle}>
            {book.description.length > 200
              ? `${book.description.substring(0, 200)}...`
              : book.description}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {book.is_from_library && (
              <button
                style={reserveButtonStyle}
                onClick={() => handleReserveClick(book._id)}
              >
                Book
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCatalog;

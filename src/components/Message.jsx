import { useGuestName } from '../hooks/useGuestName';

function Message({ visible }) {
  const { name, plural } = useGuestName();

  const invites =  `${name}`;
  const message = `vous êtes ${plural ? 'invités' : 'invité'} à venir célébrer notre amour et à partager notre bonheur !`;

  const sizeInvites = invites.split(' ').length;
  const sizeMessage = message.split(' ').length;

  // On découpe par ligne, puis par mot dans chaque ligne
  const lines = message.split('\n');
  let wordIndex = sizeInvites;

  return (
    <div className={`message-overlay ${visible ? 'visible' : ''} `}>
      <p className="message-text instrument-serif-regular-italic w-90 p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {invites.split(' ').map((word, i) => (
          <span
            key={i}
            className="message-word text-3xl"
            style={{ animationDelay: `${0.8 + i * 0.25}s` }}
          >
            {word}
          </span>
        ))}
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="message-line">
            {line.split(' ').map((word, i) => {
              const delay = (sizeInvites + 2) * 0.25 + wordIndex * 0.25;
              wordIndex++;
              return (
                <span
                  key={i}
                  className="message-word instrument-serif-regular"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {word}
                </span>
              );
            })}
          </span>
        ))}
        {/* {story.split(' ').map((word, i) => (
          <span
            key={i}
            className="message-word mea-culpa-regular text-4xl"
            style={{ animationDelay: `${(sizeInvites + sizeMessage + 5) * 0.35 + i * 0.35}s` }}
          >
            {word}
          </span>
        ))} */}
      </p>
      <img
          src="images/Home_empty.png"
          alt="Fleur"
          className="full-width-image h-full"
        />
        
    </div>
  );
}

export default Message;
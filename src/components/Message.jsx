import { useGuestName } from '../hooks/useGuestName';

function Message({ visible }) {
  const { name, plural } = useGuestName();

  const invites =  `${name}`;
  const message = `vous êtes ${plural ? 'invités' : 'invité'} à venir célébrer`;
  const story = `le plus beau jour de notre vie !`;

  const sizeInvites = invites.split(' ').length;
  const sizeMessage = message.split(' ').length;
  const sizeStory = story.split(' ').length;

  // On découpe par ligne, puis par mot dans chaque ligne
  const lines = message.split('\n');
  let wordIndex = sizeInvites;

  return (
    <div className={`message-overlay ${visible ? 'visible' : ''}`}>
      <p className="message-text instrument-serif-regular-italic p-6">
        {invites.split(' ').map((word, i) => (
          <span
            key={i}
            className="message-word text-3xl"
            style={{ animationDelay: `${0.8 + i * 0.35}s` }}
          >
            {word}
          </span>
        ))}
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="message-line">
            {line.split(' ').map((word, i) => {
              const delay = (sizeInvites + 2) * 0.35 + wordIndex * 0.35;
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
        {story.split(' ').map((word, i) => (
          <span
            key={i}
            className="message-word mea-culpa-regular text-4xl"
            style={{ animationDelay: `${(sizeInvites + sizeMessage + 5) * 0.35 + i * 0.35}s` }}
          >
            {word}
          </span>
        ))}
      </p>
      <img
          src="images/flowers_down.png"
          alt="Fleur"
          className="absolute bottom-0"
        />
        <img
          src="images/flowers_down.png"
          alt="Fleur"
          className="absolute top-0 rotate-180"
        />
    </div>
  );
}

export default Message;
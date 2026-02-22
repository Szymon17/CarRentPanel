import { type Context, type FC, useContext } from "react";

type Props = {
  name: string;
  id: string | number;
  context: Context<any>;
};

export const Sortheader: FC<Props> = ({ name, id, context }) => {
  const { setSort, sort } = useContext(context);

  const setSortFilter = () => {
    if (sort === undefined || !setSort) {
      console.error("Provided context don't have setSort or sort param");
      return;
    }

    switch (sort) {
      case `${id},DESC`:
        setSort(null);
        break;

      case `${id},ASC`:
        setSort(`${id},DESC`);
        break;

      default:
        setSort(`${id},ASC`);
        break;
    }
  };

  return (
    <span className="sortBox" title={name} onClick={setSortFilter}>
      <div className="sortBox__text">{name}</div>
      {sort === `${id},ASC` ? (
        <i className="bi bi-caret-up-fill" />
      ) : sort === `${id},DESC` ? (
        <i className="bi bi-caret-down-fill" />
      ) : (
        <span className="no_filterBox">
          <i className="bi bi-caret-up-fill" />
          <i className="bi bi-caret-down-fill" />
        </span>
      )}
    </span>
  );
};

export default Sortheader;

import SVGIcon from './SVGIcon';

const DeleteIcon = ({ ...props }) => (
  <SVGIcon height="24px" viewBox="0 0 24 24" width="24px" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 21h12V7H6v14zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </SVGIcon>
);

export default DeleteIcon;

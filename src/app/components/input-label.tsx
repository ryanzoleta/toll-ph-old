type Props = { text: string };

function InputLabel({ text }: Props) {
  return <h3 className="text-xl font-bold text-slate-400">{text}</h3>;
}

export default InputLabel;

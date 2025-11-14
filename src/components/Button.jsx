import Link from "next/link";

const Button = ({
  px = "2",
  py = "1",
  text = "Button",
  color = "white",
  bg = "black",
  href = "#",
  rounded = "rounded"
}) => {

    console.log(px)

  return (
    <Link href={href} className={`px-${px} py-${py} bg-${bg} text-${color} ${rounded}`}>
      {text}
    </Link>
  );
};

export default Button;

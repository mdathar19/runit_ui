import { FaHeart } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

export default function Footer() {
  return (
    <div className="font-light text-sm tracking-wide text-center">
      Made with <FaHeart className="h-4 w-4 text-red-400 inline-block mx-1 animate-pulse" /> by{" "}
      <strong>
        <a
          href="https://www.linkedin.com/in/md-athar-alam-a5067b18b/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline transition-all inline-flex items-center"
        >
          Athar
          <FiExternalLink className="h-3 w-3 ml-1 inline-block" />
        </a>
      </strong>
    </div>
  );
}
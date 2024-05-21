import { createIcon } from '@download/blockies';
import { useToast } from '@/components/ui/use-toast.ts';

type AddressForNavBarProps = {
  address: string;
};

export default function AddressChip(props: AddressForNavBarProps) {
  const { address } = props;

  const { toast } = useToast();

  const addressIcon = createIcon({
    seed: address.toLowerCase(),
  }).toDataURL();

  const displayAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  return (
    <div className="flex shrink-0 items-center rounded-md bg-grey-800 px-3 py-2">
      <div className="text-sm text-primary">{displayAddress}</div>
      <button
        className="-my-0.5 -mr-0.5 ml-1.5 shrink-0 bg-grey-800 px-0.5 py-0.5"
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast({
            title: 'Address copied!',
            duration: 1200,
          });
        }}
      >
        <img
          src={addressIcon}
          alt="Generated address icon"
          className="size-4 rounded-full"
        />
      </button>
    </div>
  );
}
